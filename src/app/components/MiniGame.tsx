import {useEffect, useRef, useState} from "react";

const MiniGame = ({handleUpdate}: {handleUpdate: (value: number) => void}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [playerX, setPlayerX] = useState(50);
  const [playerY, setPlayerY] = useState(Math.floor(Math.random() * 400) + 50);

  const [monsterX] = useState(700);
  const [monsterY, setMonsterY] = useState(
    Math.floor(Math.random() * 400) + 50
  );

  const [hasCollided, setHasCollided] = useState(false);

  const [monsterColor, setMonsterColor] = useState("red");
  const [monsterWidth, setMonsterWidth] = useState(30);
  const [monsterOpacity, setMonsterOpacity] = useState(1);

  useEffect(() => {
    if (
      playerX + 45 >= monsterX &&
      Math.abs(playerY - monsterY) < 70 &&
      !hasCollided
    ) {
      setHasCollided(true);
      setMonsterColor("gray");
      setMonsterOpacity(0.5);
    }
  }, [playerX, playerY, monsterX, monsterY, hasCollided]);

  useEffect(() => {
    if (hasCollided) {
      handleUpdate(1);
    }
  }, [hasCollided, handleUpdate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const drawGame = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw player with spear
      context.fillStyle = "blue";
      context.fillRect(playerX, playerY, 20, 20); // Player
      context.fillRect(playerX + 15, playerY + 10, 30, 5); // Spear

      // Draw monster
      context.fillStyle = monsterColor;
      context.globalAlpha = monsterOpacity;
      context.fillRect(monsterX, monsterY, monsterWidth, 70); // Monster
      context.globalAlpha = 1;
    };

    drawGame();
  }, [
    playerX,
    playerY,
    monsterColor,
    monsterWidth,

    monsterOpacity,
    monsterX,
    monsterY,
  ]);

  const handleKeyDown = (e: KeyboardEvent) => {
    setPlayerX((prevX) => {
      if (e.key === "ArrowRight") {
        return Math.min(prevX + 5, 780);
      }
      if (e.key === "ArrowLeft") {
        return Math.max(prevX - 5, 0);
      }
      return prevX;
    });

    setPlayerY((prevY) => {
      if (e.key === "ArrowUp") {
        return Math.max(prevY - 5, 0);
      }
      if (e.key === "ArrowDown") {
        return Math.min(prevY + 5, 480);
      }
      return prevY;
    });
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={500}
      style={{border: "1px solid #fff"}}
    />
  );
};

export default MiniGame;
