import { CSSProperties, ReactElement } from 'react';

// Add a generic type parameter T to UseDraggable and UseDraggableProps
export type UseDraggable = (props: UseDraggableProps) => {
	element: ReactElement;
};

// Extend UseDraggableProps with generic type T for additional child props
interface UseDraggableProps {
	child: ReactElement;
	bottom?: CSSProperties['bottom'];
	top?: CSSProperties['top'];
	right?: CSSProperties['right'];
	left?: CSSProperties['left'];
}

export interface UseDraggableChildProps {
	isPressed: boolean;
	setIsPressed: (isPressed: boolean) => void;
}
