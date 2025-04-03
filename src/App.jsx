import React, { useRef, useState, useEffect } from 'react';
import holyFood from '/holyFood.png';

export default function CarnivalWheel() {


const options = [
  { 
    label: 'Cancer', 
    weight: 24.6, 
    description: 'Uncontrolled cell growth affecting various organs. Eat a diet rich in vegetables, fruits, whole grains. Avoid processed meats, excess alcohol, and smoking.' 
  },
  { 
    label: 'Pneumonia', 
    weight: 23.5, 
    description: 'Lung infection causing inflammation and breathing issues. Eat foods high in antioxidants and vitamins (C, D, zinc). Avoid smoking and overly processed foods.' 
  },
  { 
    label: 'Heart Disease', 
    weight: 19.7, 
    description: 'Reduced blood flow to the heart due to narrowed arteries. Eat fatty fish, nuts, fruits, vegetables. Avoid trans fats, excess salt, and red meat.' 
  },
  { 
    label: 'Stroke', 
    weight: 5.6, 
    description: 'Interrupted blood supply to the brain. Focus on leafy greens, whole grains, and omega-3s. Avoid salty, fried, and sugary foods.' 
  },
  { 
    label: 'High Blood Pressure', 
    weight: 3.1, 
    description: 'Heart conditions caused by long-term high blood pressure. Eat potassium-rich foods (bananas, beans), low-sodium meals. Avoid processed snacks and sugary drinks.' 
  },
  { 
    label: 'Kidney Diseases', 
    weight: 3.1, 
    description: 'Damage to kidney function and filtering. Eat berries, apples, cabbage; moderate protein. Avoid high-sodium and high-phosphorus foods (e.g. processed cheese).' 
  },
  { 
    label: 'Other Heart Conditions', 
    weight: 2.4, 
    description: 'Includes irregular heartbeats and valve issues. Eat heart-healthy fats (olive oil, avocados). Avoid excessive caffeine and highly processed foods.' 
  },
  { 
    label: 'Accidents', 
    weight: 2.3, 
    description: 'Injuries, poisoning, and other external factors. No direct dietary link, but maintain overall wellness and avoid alcohol overuse.' 
  },
  { 
    label: 'Urinary Tract Infection', 
    weight: 2.0, 
    description: 'Bacterial infection in the urinary tract. Drink plenty of water, eat cranberries, vitamin C. Avoid caffeine and alcohol.' 
  },
  { 
    label: 'Chronic Lung Diseases', 
    weight: 1.2, 
    description: 'Includes chronic bronchitis and emphysema. Eat anti-inflammatory foods (turmeric, leafy greens). Avoid smoking and fried/oily foods.' 
  }
];


  
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState('');
  const [bgRotation, setBgRotation] = useState(0);

  const totalWeight = options.reduce((acc, o) => acc + o.weight, 0);

  // Animate background
  useEffect(() => {
    const interval = setInterval(() => {
      setBgRotation(prev => (prev + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const size = 300;
    const radius = size / 2;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    let startAngle = 0;
    options.forEach((option, index) => {
      const sliceAngle = (option.weight / totalWeight) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, startAngle, endAngle);
      ctx.fillStyle = getSliceColor(index);
      ctx.fill();
      ctx.closePath();

      // Text label
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px sans-serif';
      // Add text shadow for border effect
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0.5;
      ctx.shadowOffsetY = 0.5;
      ctx.fillText(option.label, radius - 5, 2);
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.restore();

      startAngle = endAngle;
    });
  }, [options, totalWeight]);

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult('');

    const fullSpins = 3 + Math.floor(Math.random() * 3);
    const extraDeg = Math.random() * 360;
    const newRotation = rotation + fullSpins * 360 + extraDeg;

    setRotation(newRotation);

    setTimeout(() => {
      const finalRotation = (newRotation % 360 + 360) % 360;
      let pointerAngle = 270 - finalRotation;
      if (pointerAngle < 0) pointerAngle += 360;

      let cumulativeDeg = 0;
      let chosenIndex = -1;
      for (let i = 0; i < options.length; i++) {
        const sliceDeg = (options[i].weight / totalWeight) * 360;
        if (pointerAngle >= cumulativeDeg && pointerAngle < cumulativeDeg + sliceDeg) {
          chosenIndex = i;
          break;
        }
        cumulativeDeg += sliceDeg;
      }

      if (chosenIndex !== -1) {
        setResult(options[chosenIndex].label);
      }
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative"
      style={{
        backgroundImage: `url(${holyFood})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-orange-300 opacity-50" style={{ zIndex: 0 }}></div>
      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="animate-bounce mt-10 -mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-[1px_1px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000]">
            What will you die from!
          </h1>

          <p className="text-lg font-bold text-white mb-6 drop-shadow-[1px_1px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000]">
            what you eat today affects how you eventually die! 
          </p>
        </div>

        <div className="relative" style={{ width: 300, height: 300 }}>
          {/* Rotating canvas with a border to resemble a carnival wheel */}
          <div
            className="w-full h-full rounded-full shadow-xl"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 3s ease-out',
            }}
          >
            <canvas ref={canvasRef} className="rounded-full" />
          </div>

          {/* Pointer (triangle) at the top - bright red with white border */}
          <div
            className="absolute z-10 left-1/2"
            style={{
              top: '-14px',
              transform: 'translateX(-50%) rotate(180deg)',
              width: 0,
              height: 0,
              borderLeft: '18px solid transparent',
              borderRight: '18px solid transparent',
              borderBottom: '36px solid white',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '5px',
                left: '-14px',
                width: 0,
                height: 0,
                borderLeft: '14px solid transparent',
                borderRight: '14px solid transparent',
                borderBottom: '28px solid red',
              }}
            />
          </div>
        </div>

        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="pulse mt-6 px-6 py-3 text-xl font-bold text-white bg-red-600 hover:bg-red-700 rounded-full shadow-lg transition disabled:opacity-50"
        >
          {isSpinning ? 'Spinning...' : 'Spin'}
        </button>

        {/* Pop-up (modal) for the result */}
        {result && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm mx-auto">
              <h2 className="text-2xl font-extrabold text-red-700 mb-4">Congratulations!</h2>
              <p className="text-lg mb-4">
                You got: <span className="font-bold text-red-700">{result}</span>
              </p>
              <p className="text-lg mb-4 text-left">{options.find(o => o.label === result).description}</p>
              <button
                className="mt-2 px-4 py-2 text-xl font-bold text-white bg-red-600 hover:bg-red-700 rounded-full shadow-lg transition"
                onClick={() => setResult('')}
              >
                Ok, I promise to eat healthier!
              </button>
            </div>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-900 mt-4">
        Source: <a href="https://www.moh.gov.sg/others/resources-and-statistics/principal-causes-of-death" className="underline hover:text-gray-700" target="_blank" rel="noopener noreferrer">Singapore Ministry of Health</a>
      </p>
    </div>
  );
}

function getSliceColor(index) {
  // Slightly vary the hue for each slice for a vibrant carnival look
  const hue = (index * 137) % 360;
  return `hsl(${hue}, 90%, 50%)`;
}
