import './CustomLegend.css';

import type { LegendProps } from 'recharts';
import { useTranslation } from 'react-i18next';

export const CustomLegend: React.FC<LegendProps> = ({ payload }) => {

  const [t] = useTranslation();

  return (
    <ul className='legend'>
      {
        payload?.map((v, i) => {
          if (v.value === 'gross') {
            return <li className='legend__item' key={i}>{t('earnings')}</li>
          } else if (v.value === 'invested') {
            return <li className='legend__item' key={i}>{t('invested')}</li>
          }
        })
      }
    </ul>
  )
}