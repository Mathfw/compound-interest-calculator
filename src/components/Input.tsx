import './input.css';

import React, { useContext, type ChangeEvent } from "react";
import { LangContext } from '../App';
import { useTranslation } from 'react-i18next'

type Props = {
  value: string;
  type: 'money' | 'metric';
  setValue: (v: string) => void;
  name?: string;
  id?: string;
  pattern?: string;
  placeholder?: string;
  children?: React.ReactNode;
  metricLabel?: string;
  metricValue?: string;
  setMetric?: (v: string) => void;
}

export default function Input(props: Props): React.ReactNode {

  const formatCurrency = (v: string): string => {
    const num = v.replace(/\D/g, '');
    const float = (Number(num) / 100).toLocaleString(lang.value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return float;
  }


  const lang = useContext(LangContext);
  const { t, i18n } = useTranslation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value;
    switch (props.type) {
      case 'money':
        if (isNaN(parseFloat(v))) {
          props.setValue('');
          return;
        }
        props.setValue(formatCurrency(v))
        break;
      case 'metric':
        props.setValue(v);
        break;
      default:
        break;
    }
  }

  return(
    <div>
      <label>
        <input
          type='text'
          name={props.name}
          value={props.value}
          onChange={handleChange}
          placeholder={props.placeholder}
          pattern={props.pattern}
        />
        <span>{props.children}</span>
      </label>
      {
        props.type === 'metric' ?
        <label>
          <select value={props.metricValue} onChange={(e) => props.setMetric ? props.setMetric(e.currentTarget.value) : null}>
            <option value="months">{t('months')}</option>
            <option value="years">{t('years')}</option>
          </select>
          <span>{props.metricLabel}</span>
        </label> :
        null
      }
    </div>
  )
}