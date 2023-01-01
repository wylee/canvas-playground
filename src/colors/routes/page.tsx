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

function randIn(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);
  const [bgColor, setBgColor] = useState(0);

  const r = 10;
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [reverseX, setReverseX] = useState(false);
  const [reverseY, setReverseY] = useState(false);

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
      const [minX, maxX] = [r, randIn(r, w / 8)];
      const [minY, maxY] = [r, randIn(r, h / 8)];
      canvas.width = w;
      canvas.height = h;
      setX(randIn(minX, maxX));
      setY(randIn(minY, maxY));
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

  useInterval(
    useCallback(() => {
      const canvas = canvasRef?.current;
      if (canvas) {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;

        // Distance to move
        let xm = Math.random();
        let ym = Math.random();

        // Weighting of whether to move in positive (right/down) or
        // negative (left/up) direction. A larger number means greater
        // probability of moving in the positive direction. The basic
        // idea is to generally move right/down with a little gitter.
        let xdp = 80 + randIn(-8, 8);
        let ydp = 56 + randIn(-2, 2);

        if (reverseX) {
          xm = -xm;
          ydp = xdp + randIn(-8, 8);
        }
        if (reverseY) {
          ym = -ym;
          xdp = ydp + randIn(-2, 2);
        }

        let newX = x + (randIn(0, 100) < xdp ? xm : -xm);
        let newY = y + (randIn(0, 100) < ydp ? ym : -ym);

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
        const lx = w - r;
        const ly = h - r;
        if (newX >= lx && !reverseX) {
          setReverseX(true);
        } else if (newX <= r && reverseX) {
          setReverseX(false);
        }
        if (newY >= ly && !reverseY) {
          setReverseY(true);
        } else if (newY <= r && reverseY) {
          setReverseY(false);
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
