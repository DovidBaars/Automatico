import { DOMAttributes } from 'react';

export interface MagicMenuProps {
	triggerText: string;
	renderComponent: DOMAttributes<HTMLDivElement>['children'];
}
