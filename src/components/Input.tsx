import './input.css';

import React, { useContext, type ChangeEvent } from "react";
import { LangContext } from '../contexts/LangContext';

type Props = {
  value: string;
  type: 'money' | 'text';
  setValue: (v: string) => void;
  name?: string;
  id?: string;
  pattern?: string;
  required?: boolean;
  placeholder?: string;
  children?: React.ReactNode;
}

export default function Input(props: Props): React.ReactNode {

  const lang = useContext(LangContext);

  const formatCurrency = (v: string): string => {
    const num = v.replace(/\D/g, '');
    const float = (Number(num) / 100).toLocaleString(lang.value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return float;
  }

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
      case 'text':
        props.setValue(v);
        break;
      default:
        break;
    }
  }

  return(
    <label className='input'>
      <input
        type='text'
        name={props.name}
        value={props.value}
        onChange={handleChange}
        placeholder={props.placeholder}
        pattern={props.pattern}
        required={props.required}
        className='input__element'
      />
      <span className='input__label'>{props.children}</span>
    </label>
  )
}