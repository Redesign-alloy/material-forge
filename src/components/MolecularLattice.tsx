 import { useEffect, useRef } from 'react';
 import { motion } from 'framer-motion';
 
 interface Node {
   x: number;
   y: number;
   vx: number;
   vy: number;
 }
 
 export function MolecularLattice() {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const nodesRef = useRef<Node[]>([]);
   const animationRef = useRef<number>();
 
   useEffect(() => {
     const canvas = canvasRef.current;
     if (!canvas) return;
 
     const ctx = canvas.getContext('2d');
     if (!ctx) return;
 
     const resize = () => {
       canvas.width = window.innerWidth;
       canvas.height = window.innerHeight;
       initNodes();
     };
 
     const initNodes = () => {
       const nodeCount = Math.floor((canvas.width * canvas.height) / 25000);
       nodesRef.current = Array.from({ length: nodeCount }, () => ({
         x: Math.random() * canvas.width,
         y: Math.random() * canvas.height,
         vx: (Math.random() - 0.5) * 0.5,
         vy: (Math.random() - 0.5) * 0.5,
       }));
     };
 
     const animate = () => {
       if (!ctx || !canvas) return;
 
       ctx.fillStyle = 'rgba(45, 55, 72, 0.1)';
       ctx.fillRect(0, 0, canvas.width, canvas.height);
 
       const nodes = nodesRef.current;
       const connectionDistance = 150;
 
       // Update positions
       nodes.forEach(node => {
         node.x += node.vx;
         node.y += node.vy;
 
         // Bounce off edges
         if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
         if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
 
         node.x = Math.max(0, Math.min(canvas.width, node.x));
         node.y = Math.max(0, Math.min(canvas.height, node.y));
       });
 
       // Draw connections
       ctx.strokeStyle = 'rgba(79, 209, 197, 0.15)';
       ctx.lineWidth = 1;
 
       for (let i = 0; i < nodes.length; i++) {
         for (let j = i + 1; j < nodes.length; j++) {
           const dx = nodes[i].x - nodes[j].x;
           const dy = nodes[i].y - nodes[j].y;
           const distance = Math.sqrt(dx * dx + dy * dy);
 
           if (distance < connectionDistance) {
             const opacity = 1 - distance / connectionDistance;
             ctx.strokeStyle = `rgba(79, 209, 197, ${opacity * 0.2})`;
             ctx.beginPath();
             ctx.moveTo(nodes[i].x, nodes[i].y);
             ctx.lineTo(nodes[j].x, nodes[j].y);
             ctx.stroke();
           }
         }
       }
 
       // Draw nodes
       nodes.forEach(node => {
         const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 4);
         gradient.addColorStop(0, 'rgba(79, 209, 197, 0.8)');
         gradient.addColorStop(1, 'rgba(79, 209, 197, 0)');
         
         ctx.fillStyle = gradient;
         ctx.beginPath();
         ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
         ctx.fill();
       });
 
       animationRef.current = requestAnimationFrame(animate);
     };
 
     resize();
     window.addEventListener('resize', resize);
     animate();
 
     return () => {
       window.removeEventListener('resize', resize);
       if (animationRef.current) {
         cancelAnimationFrame(animationRef.current);
       }
     };
   }, []);
 
   return (
     <motion.canvas
       ref={canvasRef}
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       transition={{ duration: 2 }}
       className="fixed inset-0 pointer-events-none"
       style={{ background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #1a202c 100%)' }}
     />
   );
 }