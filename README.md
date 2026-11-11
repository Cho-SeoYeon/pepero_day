# 🍫 pepero_day

친구에게 직접 꾸민 빼빼로와 편지를 링크로 보내는 빼빼로데이 이벤트 페이지.

- **만들기** (`index.html`): 빼빼로 5개의 코팅·토핑·드리즐을 고르고, 받는 사람·편지·보내는 사람을 적은 뒤 **선물 링크 만들기**
- **받기** (`index.html#g=...`): 리본 상자를 누르면 뚜껑이 열리고 빼빼로가 나타남 → **편지 읽기**로 손글씨 편지 확인

## 🎴 빼빼로 뽑기 (`card/`)

볼을 누르면 흔들흔들 → 반짝 열리면서 빼빼로 20종 중 하나가 몬스터 카드처럼 랜덤으로 등장합니다.
등급(노멀 ● / 언커먼 ◆ / 레어 ★ / 울트라 레어 ★★)에 따라 확률과 반짝임이 다르고, 뽑은 카드는 도감에 모여요.

받는 사람 이름 넣어서 보내기: `https://<내아이디>.github.io/pepero_day/card/?to=서아&from=너의베프`

서버·DB 없이 동작합니다. 선물 내용은 링크의 `#g=` 뒤에 인코딩되어 들어가므로, 링크를 가진 사람만 볼 수 있어요.

## 로컬에서 보기

`index.html`을 브라우저로 열면 끝. (또는 `npx serve .`)

## GitHub Pages로 배포

```bash
git add .
git commit -m "Pepero day gift page"
git remote add origin https://github.com/<내아이디>/pepero_day.git
git push -u origin main
```

GitHub 저장소 → **Settings → Pages → Branch: `main` / `(root)`** 저장.
1~2분 뒤 `https://<내아이디>.github.io/pepero_day/` 에서 열리고, 거기서 만든 링크를 친구에게 보내면 됩니다.
