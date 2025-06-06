import type { LegendProps } from "recharts"
import { useTranslation } from "react-i18next";

export const CustomLegend: React.FC<LegendProps> = ({ payload }) => {

  const [t, i18n] = useTranslation();

  return (
    <ul style={{display: 'flex', width: 'full', alignItems: 'center', justifyContent: 'center', gap: '1.5em'}}>
      {
        payload?.map((v, i) => {
          if (v.value === 'gross') {
            return <li key={i}>{t('earnings')}</li>
          } else if (v.value === 'invested') {
            return <li key={i}>{t('invested')}</li>
          }
        })
      }
    </ul>
  )
}