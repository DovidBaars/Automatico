import styles from './useDraggable.module.css';
import React, { useState, useRef } from 'react';
import Draggable, { DraggableEvent } from 'react-draggable';
import { UseDraggable } from './interface';

const useDraggable: UseDraggable = ({ child, ...rest }) => {
	const [isPressed, setIsPressed] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const dragRef = useRef(null);

	const handleDrag = (e: DraggableEvent, data: { x: number; y: number }) => {
		setPosition({ x: data.x, y: data.y });
		const distance = Math.sqrt(
			Math.pow(data.x - position.x, 2) + Math.pow(data.y - position.y, 2)
		);
		distance > 5 && setIsDragging(true);
	};

	const handleStop = () => {
		isDragging ? setIsDragging(false) : setIsPressed(!isPressed);
	};

	return {
		element: (
			<Draggable
				position={position}
				onStop={handleStop}
				onDrag={handleDrag}
				nodeRef={dragRef}
			>
				<div
					className={styles.draggableElement}
					ref={dragRef}
					style={{ ...rest }}
				>
					{React.cloneElement(child, { isPressed, setIsPressed })}
				</div>
			</Draggable>
		),
	};
};

export default useDraggable;
