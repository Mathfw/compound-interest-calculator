import React, { useEffect, useRef, useState } from "react";

import DonwArrow from '../assets/down-arrow.svg?react'

type Props = {
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [])

  const toggleSelect = () => setOpen(prev => !prev);

  const handleOptionClick = (option: string) => {
    setSelected(option);
    setOpen(false);
    if (props.onChange) props.onChange(option);
  };

  return (
    <div ref={containerRef}>
      <button
        type="button"
        onClick={toggleSelect}
      >
        <span>{ props.placeholder || selected }</span>
        <DonwArrow />
      </button>
      {
        open ?
        <ul>
          {
            props.options.map((option, i) => {
              return (
                <li key={i} onClick={() => handleOptionClick(option)}>
                  {option}
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