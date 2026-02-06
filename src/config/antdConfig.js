import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'

// Antd 中文配置
export const antdConfig = {
  zh: {
    locale: zhCN,
    theme: {
      token: {
        colorPrimary: '#006837',
        borderRadius: 8,
      },
    },
  },
  en: {
    locale: enUS,
    theme: {
      token: {
        colorPrimary: '#006837',
        borderRadius: 8,
      },
    },
  },
}

// 获取当前语言的Antd配置
export const getAntdConfig = (language) => {
  return antdConfig[language] || antdConfig.zh
}
