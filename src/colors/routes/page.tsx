/* Home Page */
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { useInterval } from "../hooks";

const TWO_PI = Math.PI * 2;

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const RunState = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 0.125rem;
  cursor: pointer;
  font-size: 2rem;
  line-height: 1;
  transform: translate(-50%, -50%);
  > * {
    margin-bottom: 1rem;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [running, setRunning] = useState(false);
  const [radius, setRadius] = useState(0);
  const [bgColor, setBgColor] = useState(0);

  const toggleRunning = () => setRunning(!running);
  const fgColor = (bgColor + 180) % 360;
  const backgroundColor = `hsl(${bgColor}, 100%, 50%)`;
  const color = `hsl(${fgColor}, 100%, 50%)`;

  // Set canvas dimensions and start running on mount.
  useEffect(() => {
    const canvas = canvasRef?.current;
    if (canvas) {
      const [w, h] = [canvas.clientWidth, canvas.clientHeight];
      [canvas.width, canvas.height] = [w, h];
      setRadius(getInitialRadius(w, h));
      setRunning(true);
    }
  }, []);

  // Update background color.
  useInterval(
    useCallback(() => {
      setBgColor((bgColor + 1) % 360);
    }, [bgColor]),
    canvasRef?.current && running,
    200
  );

  // Draw image.
  useInterval(
    useCallback(() => {
      const canvas = canvasRef?.current as HTMLCanvasElement;
      setRadius(draw(canvas, radius, color));
    }, [color, radius]),
    canvasRef?.current && running,
    50
  );

  return (
    <Container onClick={toggleRunning}>
      {running ? null : (
        <RunState
          title="Click to resume"
          style={{ backgroundColor: color, color: backgroundColor }}
        >
          <div>{color}</div>
          <div>on</div>
          <div>{backgroundColor}</div>
        </RunState>
      )}

      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor,
        }}
      >
        <h2>Color Canvas</h2>
        <p>You might need to enable JavaScript.</p>
      </canvas>
    </Container>
  );
}

function getInitialRadius(w, h) {
  const initialRadius = Math.floor(Math.min(w, h) / 4);
  return initialRadius % 2 === 0 ? initialRadius : initialRadius - 1;
}

function randIn(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function draw(canvas, radius, color) {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return radius;
  }

  const [w, h] = [canvas.clientWidth, canvas.clientHeight];
  const [cx, cy] = [Math.floor(w / 2), Math.floor(h / 2)];

  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  // Top left
  ctx.beginPath();
  ctx.arc(cx - radius, cy - radius, radius, 0, TWO_PI, false);
  ctx.stroke();

  // Top right
  ctx.beginPath();
  ctx.arc(cx + radius, cy - radius, radius, 0, TWO_PI, false);
  ctx.stroke();

  // Bottom right
  ctx.beginPath();
  ctx.arc(cx + radius, cy + radius, radius, 0, TWO_PI, false);
  ctx.stroke();

  // Bottom left
  ctx.beginPath();
  ctx.arc(cx - radius, cy + radius, radius, 0, TWO_PI, false);
  ctx.stroke();

  let newRadius = radius / 2;
  if (newRadius < 8) {
    newRadius = getInitialRadius(w, h) - randIn(4, Math.min(cx, cy) / 8);
  }
  return newRadius;
}
