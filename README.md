# Kollus Sample ReactJS

ReactJS 기반 Kollus 예제 프로젝트

# Feature

- VOD Upload
- VOD List Page
  - 플랫폼 Callback 연동, 채널에 영상 추가 및 삭제 시 DB update
  - 영상 재생 시 LMS Callback 수집 후 실시간으로 표시
  - 재생 중인 화면에서만 LMS callback 이 표시됨
- VOD Download
  - DRM Callback 으로 DRM VOD 시간 갱신
  - 다운로드 시 만료는 현재 시간 + 10분 / 갱신할 때 10분 추가
- VOD Play
  - 암호화 및 비암호화 영상 재생

# Tech Stack
- node.js (v16.15.1)
- express.js
- react.js
- socket.io
- mui

# Screenshot

![screen1](/screenshot/screen1.png)

![screen2](/screenshot/screen2.png)