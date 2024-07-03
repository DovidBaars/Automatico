import { useMantineTheme } from "@mantine/core";

export function AutomaticoLogo(props: React.ComponentPropsWithoutRef<'svg'>) {
    const { fontFamilyMonospace } = useMantineTheme();

    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100">
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#339AF0" />
                    <stop offset="100%" stopColor="#22C55E" />
                </linearGradient>
            </defs>
            <text
                x="150"
                y="65"
                fontFamily={fontFamilyMonospace}
                fontSize="48"
                fontWeight="bold"
                textAnchor="middle"
                fill="url(#gradient)"
            >
                Automatico
            </text>
        </svg >
    );
}