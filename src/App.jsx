import React, { useRef, useState, useEffect } from 'react';

export default function CarnivalWheel() {
  const options = [
    { label: 'Option 1', weight: 1 },
    { label: 'Option 2', weight: 3 },
    { label: 'Option 3', weight: 2 },
    { label: 'Option 4', weight: 4 },
  ];

  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState('');

  const totalWeight = options.reduce((acc, o) => acc + o.weight, 0);

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
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(option.label, radius - 10, 5);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-300 via-red-300 to-pink-300 p-4">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-md mb-6">
        Carnival Spin!
      </h1>

      <div className="relative" style={{ width: 300, height: 300 }}>
        {/* Rotating canvas with a border to resemble a carnival wheel */}
        <div
          className="w-full h-full rounded-full border-8 border-white shadow-xl"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 3s ease-out',
          }}
        >
          <canvas ref={canvasRef} className="rounded-full" />
        </div>

        {/* Pointer (triangle) at the top - bright red to stand out */}
        <div
          className="absolute z-10 left-1/2"
          style={{
            top: '-14px',
            transform: 'translateX(-50%) rotate(180deg)',
            width: 0,
            height: 0,
            borderLeft: '14px solid transparent',
            borderRight: '14px solid transparent',
            borderBottom: '28px solid red',
          }}
        />
      </div>

      <button
        onClick={spinWheel}
        disabled={isSpinning}
        className="mt-6 px-6 py-3 text-xl font-bold text-white bg-red-600 hover:bg-red-700 rounded-full shadow-lg transition disabled:opacity-50"
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
            <button
              className="mt-2 px-4 py-2 text-xl font-bold text-white bg-red-600 hover:bg-red-700 rounded-full shadow-lg transition"
              onClick={() => setResult('')}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function getSliceColor(index) {
  // Slightly vary the hue for each slice for a vibrant carnival look
  const hue = (index * 137) % 360;
  return `hsl(${hue}, 90%, 50%)`;
}
