import './CustomTooltip.css';

import { useContext } from "react";
import { LangContext } from "../contexts/LangContext";
import type { TooltipProps } from "recharts";

export const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {

  const lang = useContext(LangContext);

  if (active && payload && payload.length) {
    const posInvested = payload.find(p => p.dataKey === 'invested')?.value ?? 0;
    const posOffset = payload.find(p => p.dataKey === 'gross')?.value ?? 0;
    const difference = posOffset - posInvested;

    return (
      <div className='tooltip'>
        <p className='tooltip__label'><strong>month:</strong> {label}</p>
        <p className='tooltip__label'><strong>invested:</strong> USD: {posInvested.toLocaleString(lang.value)}</p>
        <p className='tooltip__label'><strong>earnings:</strong> USD: {difference.toLocaleString(lang.value)}</p>
      </div>
    );
  }
  return null;
};