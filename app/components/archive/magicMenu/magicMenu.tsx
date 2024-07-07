import styles from './magicMenu.module.css';
import { useLayer, Arrow } from 'react-laag';
import { MagicMenuProps } from './interface';
import { UseDraggableChildProps } from '@/components/archive/useDraggable/interface';

const MagicMenu: React.FC<MagicMenuProps> = (props) => {
	const { isPressed, setIsPressed, triggerText, renderComponent } =
		props as MagicMenuProps & UseDraggableChildProps;

	const { renderLayer, triggerProps, layerProps, arrowProps } = useLayer({
		isOpen: isPressed,
		auto: true,
		snap: true,
		preferY: 'top',
		triggerOffset: 17,
		onDisappear: () => setIsPressed(false),
	});

	return (
		<>
			<button {...triggerProps}>{triggerText}</button>
			{isPressed &&
				renderLayer(
					<div
						className={styles.layer}
						ref={layerProps.ref}
						style={layerProps.style}
					>
						{renderComponent}
						{/* @ts-expect-error Arrow SVG does not match type */}
						<Arrow {...arrowProps} size={13} roundness={1} />
					</div>
				)}
		</>
	);
};

export default MagicMenu;
