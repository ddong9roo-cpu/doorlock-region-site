# 서울·경기·인천 도어락 지역 홈페이지 (독립형)

나인도어락 상호, 로고, 전화번호를 사용하지 않는 별도 서비스 사이트입니다. 전화번호는 비워 둔 상태로 시작합니다.

## 기술
- Next.js 15 App Router + React 19
- Supabase PostgreSQL (지역 데이터 및 공통 설정)
- 관리자 비밀번호 + 서명된 HttpOnly 세션 쿠키
- Vercel 배포 가능, 모바일 반응형

## 1. Supabase
1. Supabase에서 프로젝트 생성
2. SQL Editor에 `supabase/schema.sql` 실행
3. Project Settings → API에서 프로젝트 URL과 `service_role` 키 확인. **service_role 키를 브라우저/깃허브에 절대 공개하지 마세요.**

## 2. GitHub + Vercel (스마트폰 브라우저 가능)
1. 이 ZIP 압축을 풀어 GitHub 새 비공개 저장소에 파일 업로드
2. Vercel에서 해당 저장소 Import
3. Environment Variables에 다음 입력
   - `SUPABASE_URL`: Supabase 프로젝트 URL
   - `SUPABASE_SERVICE_ROLE_KEY`: 서버 전용 키
   - `ADMIN_PASSWORD`: 길고 고유한 관리자 비밀번호
   - `ADMIN_SESSION_SECRET`: 충분히 긴 임의의 비밀 문자열 (32자 이상 권장)
   - `NEXT_PUBLIC_SITE_URL`: 실제 연결한 사이트의 `https://` 주소 (한글 도메인 가능)
4. Deploy 후 `/admin` 접속 → 로그인 → 공통 설정 및 지역 추가
5. 지역별 실제 서비스 가능 여부를 확인한 뒤에만 '페이지 공개' 선택

## 3. 한글 도메인 연결
한글 도메인을 등록한 후 Vercel 프로젝트 Domains에서 추가하고, 등록업체 DNS 안내대로 설정하세요. 한글 도메인은 내부적으로 Punycode로 변환될 수 있습니다. `NEXT_PUBLIC_SITE_URL`에는 실제 서비스하는 대표 HTTPS 주소를 입력하세요.

## 4. 페이지 주소
- `/` 메인
- `/seoul/gangnam` 강남구 (관리자에서 등록하고 공개해야 표시됨)
- `/gyeonggi/guri` 구리시
- `/incheon/bupyeong` 부평구
- `/admin` 모바일 관리자
- `/sitemap.xml` 공개 지역만 자동 포함
- `/robots.txt` 관리자 검색 제외

## 5. 지역 데이터
관리자에서 서울·경기·인천 시군구를 추가하고 동네와 지역 고유 설명을 입력합니다. 소스의 `lib/data.ts`에 서울·경기·인천 24개 지역 예시 데이터가 들어 있지만, **실제 서비스 가능 여부가 검증되지 않았으므로 사이트에는 자동 게시되지 않습니다.** 실제 등록은 관리자에서 진행합니다.

## 6. 운영 주의
- 현재는 배포 전 소스코드이며 실제 서버/도메인/DB에 연결되지 않았습니다.
- 전화번호 미입력 시 전화 버튼이 숨겨집니다.
- 24시간 운영 표시는 실제 운영할 때만 활성화하세요.
- 실제 서비스 지역이 아닌 곳을 서비스 지역이라고 게시하지 마세요.
- 사업자·개인정보 관련 법적 고지 및 실제 운영자 정보는 운영 형태에 맞게 추가하세요.
- 지역명만 바꾼 복제 페이지는 검색 품질에 불리할 수 있으므로 지역별 실제 사례와 유용한 정보를 추가하세요.
- 보안 강화를 위해 운영 전 로그인 시도 제한, 관리자 2단계 인증, 백업 및 감사 로그를 추가하는 것을 권장합니다.

## 로컬 개발
`npm install` → `.env.example`을 `.env.local`로 복사 후 환경변수 입력 → `npm run dev`

## 검증
`npm run build`로 타입 검사 및 프로덕션 빌드를 확인하세요.
