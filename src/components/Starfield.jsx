import { useEffect, useRef } from 'react';

export default function Starfield() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    // Stars
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.8 + 0.3,
      speed: Math.random() * 0.2 + 0.02,
      opacity: Math.random(),
      twinkle: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      color: ['#ffffff', '#a5d8ff', '#ffe4b5', '#e6e6fa'][Math.floor(Math.random() * 4)],
      depth: Math.random() * 0.5 + 0.2,
    }));

    // Shooting stars
    let shootingStars = [];
    const spawnShootingStar = () => {
      if (Math.random() > 0.98) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height / 2),
          vx: -6 - Math.random() * 4,
          vy: 3 + Math.random() * 2,
          life: 1,
          length: 80 + Math.random() * 60,
        });
      }
    };

    let t = 0;
    let raf;
    const animate = () => {
      t += 0.005;

      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#050813');
      gradient.addColorStop(0.5, '#0a0e1a');
      gradient.addColorStop(1, '#0d1226');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Nebula glow
      const nebulaX = canvas.width * 0.75 + Math.sin(t) * 30;
      const nebulaY = canvas.height * 0.25 + Math.cos(t) * 20;
      const nebulaGrad = ctx.createRadialGradient(
        nebulaX, nebulaY, 0,
        nebulaX, nebulaY, 300
      );
      nebulaGrad.addColorStop(0, 'rgba(0, 100, 255, 0.15)');
      nebulaGrad.addColorStop(1, 'rgba(0, 100, 255, 0)');
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const nebula2X = canvas.width * 0.2 + Math.cos(t * 0.8) * 40;
      const nebula2Y = canvas.height * 0.7 + Math.sin(t * 0.8) * 30;
      const nebula2Grad = ctx.createRadialGradient(
        nebula2X, nebula2Y, 0,
        nebula2X, nebula2Y, 250
      );
      nebula2Grad.addColorStop(0, 'rgba(255, 0, 150, 0.08)');
      nebula2Grad.addColorStop(1, 'rgba(255, 0, 150, 0)');
      ctx.fillStyle = nebula2Grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw moon (big, soft)
      const moonX = canvas.width * 0.85 + mouseRef.current.x * 15;
      const moonY = canvas.height * 0.15 + mouseRef.current.y * 10;
      const moonR = 60;

      // Moon glow
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonR * 3);
      moonGlow.addColorStop(0, 'rgba(255, 250, 230, 0.25)');
      moonGlow.addColorStop(0.4, 'rgba(255, 250, 230, 0.08)');
      moonGlow.addColorStop(1, 'rgba(255, 250, 230, 0)');
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR * 3, 0, Math.PI * 2);
      ctx.fill();

      // Moon body
      const moonGrad = ctx.createRadialGradient(
        moonX - 15, moonY - 15, 0,
        moonX, moonY, moonR
      );
      moonGrad.addColorStop(0, '#f5f5dc');
      moonGrad.addColorStop(0.7, '#d4c9a8');
      moonGrad.addColorStop(1, '#8a7f66');
      ctx.fillStyle = moonGrad;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.fill();

      // Moon craters
      ctx.fillStyle = 'rgba(120, 110, 90, 0.4)';
      [[10, 5, 8], [-20, 15, 10], [20, 25, 6], [-10, -20, 7], [30, -10, 5]].forEach(
        ([cx, cy, r]) => {
          ctx.beginPath();
          ctx.arc(moonX + cx, moonY + cy, r, 0, Math.PI * 2);
          ctx.fill();
        }
      );

      // Draw planet with ring (Saturn-like, subtle)
      const planetX = canvas.width * 0.12 + mouseRef.current.x * -10;
      const planetY = canvas.height * 0.35 + mouseRef.current.y * -8;
      const planetR = 35;

      // Planet glow
      const planetGlow = ctx.createRadialGradient(planetX, planetY, 0, planetX, planetY, planetR * 2.5);
      planetGlow.addColorStop(0, 'rgba(255, 100, 150, 0.2)');
      planetGlow.addColorStop(1, 'rgba(255, 100, 150, 0)');
      ctx.fillStyle = planetGlow;
      ctx.beginPath();
      ctx.arc(planetX, planetY, planetR * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Ring
      ctx.save();
      ctx.translate(planetX, planetY);
      ctx.rotate(-0.4);
      ctx.scale(1, 0.3);
      ctx.strokeStyle = 'rgba(255, 180, 200, 0.5)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, planetR * 1.7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255, 200, 220, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, planetR * 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Planet body
      const planetGrad = ctx.createRadialGradient(
        planetX - 10, planetY - 10, 0,
        planetX, planetY, planetR
      );
      planetGrad.addColorStop(0, '#ff8fb1');
      planetGrad.addColorStop(0.7, '#c94a6b');
      planetGrad.addColorStop(1, '#6b1f35');
      ctx.fillStyle = planetGrad;
      ctx.beginPath();
      ctx.arc(planetX, planetY, planetR, 0, Math.PI * 2);
      ctx.fill();

      // Stars
      stars.forEach((star) => {
        star.opacity += star.twinkle;
        if (star.opacity > 1 || star.opacity < 0.15) star.twinkle *= -1;

        const parallaxX = mouseRef.current.x * 20 * star.depth;
        const parallaxY = mouseRef.current.y * 20 * star.depth;

        ctx.save();
        ctx.globalAlpha = star.opacity;

        // Star glow
        if (star.radius > 1.2) {
          const starGlow = ctx.createRadialGradient(
            star.x + parallaxX, star.y + parallaxY, 0,
            star.x + parallaxX, star.y + parallaxY, star.radius * 5
          );
          starGlow.addColorStop(0, star.color);
          starGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = starGlow;
          ctx.beginPath();
          ctx.arc(star.x + parallaxX, star.y + parallaxY, star.radius * 5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x + parallaxX, star.y + parallaxY, star.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      // Shooting stars
      spawnShootingStar();
      shootingStars = shootingStars.filter((s) => s.life > 0);
      shootingStars.forEach((s) => {
        const tailGrad = ctx.createLinearGradient(
          s.x, s.y,
          s.x + s.length * (s.vx / Math.abs(s.vx)) * -1,
          s.y - s.length * 0.5
        );
        tailGrad.addColorStop(0, `rgba(255, 255, 255, ${s.life})`);
        tailGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = tailGrad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 8, s.y - s.vy * 8);
        ctx.stroke();

        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.02;
      });

      raf = requestAnimationFrame(animate);
    };
    animate();

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseRef.current = { x, y };
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        const y = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
        mouseRef.current = { x, y };
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full"
      style={{ touchAction: 'pan-y' }}
    />
  );
}
