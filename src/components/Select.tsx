import './Select.css';

import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';

import DonwArrow from '../assets/down-arrow.svg?react';

type Props = {
  placeholder: string;
  options: string[];
  onChange?: (value: string) => void;
}

export default function Select(props: Props): React.ReactNode {

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');

  const containerRef = useRef<HTMLDivElement|null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    }
  }, [])

  const toggleSelect = () => setOpen(prev => !prev);

  const handleOptionClick = (option: string) => {
    setSelected(option);
    setOpen(false);
    if (props.onChange) props.onChange(option);
  };

  const { t } = useTranslation();

  return (
    <div ref={containerRef} className='select'>
      <button
        type='button'
        onClick={toggleSelect}
        className="trigger"
      >
        <span className="trigger__content">{ t(selected) || props.placeholder }</span>
        <span className="trigger__icon"><DonwArrow /></span>
      </button>
      {
        open ?
        <ul className="list">
          {
            props.options.map((option, i) => {
              return (
                <li key={i} onClick={() => handleOptionClick(option)}
                className="list__item">
                  {t(option)}
                </li>
              )
            })
          }
        </ul>:
        null
      }
    </div>
  )
}