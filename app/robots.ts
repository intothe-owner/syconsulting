import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      // 모든 검색 엔진 로봇(*)에 대해 접근을 허용합니다.
      userAgent: '*',
      allow: '/',
      // 만약 관리자 페이지 등 검색에 노출되지 않아야 할 경로가 있다면 아래처럼 추가하세요.
      // disallow: '/admin/', 
    },
    // 앞서 만든 사이트맵 주소도 여기에 명시해 주면 검색 로봇이 더 쉽게 사이트맵을 찾습니다.
    sitemap: 'https://www.syconsulting.co.kr/sitemap.xml', 
  };
}