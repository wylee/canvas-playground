/* Home Page */
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { useInterval } from "../hooks";

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
  const [bgColor, setBgColor] = useState(0);

  const r = 32;
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const fgColor = (bgColor + 180) % 360;
  const backgroundColor = `hsl(${bgColor}, 100%, 50%)`;
  const color = `hsl(${fgColor}, 100%, 50%)`;
  const toggleRunning = () => setRunning(!running);

  // Mount
  //
  // 1. Set canvas width.
  // 2. Set initial circle coordinates randomly in top left.
  // 3. Start running.
  useEffect(() => {
    const canvas = canvasRef?.current;
    if (canvas) {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const [minX, maxX] = [r, Math.floor(w / 4) - r];
      const [minY, maxY] = [r, Math.floor(h / 4) - r];
      canvas.width = w;
      canvas.height = h;
      setX(Math.floor(Math.random() * (maxX - minX + 1)) + minX);
      setY(Math.floor(Math.random() * (maxY - minY + 1)) + minY);
      setRunning(true);
    }
  }, []);

  // Update background color.
  useInterval(
    useCallback(() => {
      setBgColor((bgColor + 1) % 360);
    }, [bgColor]),
    100,
    canvasRef?.current && running,
    "update background color"
  );

  // Update circle position and color.
  useInterval(
    useCallback(() => {
      const canvas = canvasRef?.current;
      if (canvas) {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        const c = 0.7;
        const m = 0.2;
        let newX = x + (Math.random() < c ? m : -m);
        let newY = y + (Math.random() < c ? m : -m);
        if (newX < r) {
          newX = r;
        } else if (newX > w - r) {
          newX = w - r;
        }
        if (newY < r) {
          newY = r;
        } else if (newY > h - r) {
          newY = h - r;
        }
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2, false);
          ctx.fill();
        }
        setX(newX);
        setY(newY);
      }
    }, [color, x, y]),
    1,
    canvasRef?.current && running,
    "update circle"
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
