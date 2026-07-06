import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.syconsulting.co.kr';

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'yearly', // 얼마나 자주 바뀌는지 (always, hourly, daily, weekly, monthly, yearly, never)
      priority: 1,               // 0.0 ~ 1.0 사이의 중요도 (메인 페이지는 보통 1)
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/dev`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // 필요한 정적 경로들을 이 배열 안에 계속 추가해주면 됩니다.
  ];
}