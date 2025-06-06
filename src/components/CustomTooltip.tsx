import { useContext } from "react";
import { LangContext } from "../App";
import type { TooltipProps } from "recharts";

export const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {

  const lang = useContext(LangContext);

  if (active && payload && payload.length) {
    const posInvested = payload.find(p => p.dataKey === 'invested')?.value ?? 0;
    const posOffset = payload.find(p => p.dataKey === 'gross')?.value ?? 0;
    const difference = posOffset - posInvested;

    return (
      <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #ccc', padding: '8px' }}>
        <p><strong>month:</strong> {label}</p>
        <p><strong>invested:</strong> USD: {posInvested.toLocaleString(lang.value)}</p>
        <p><strong>earnings:</strong> USD: {difference.toLocaleString(lang.value)}</p>
      </div>
    );
  }
  return null;
};