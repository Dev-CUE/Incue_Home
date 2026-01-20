# EmailJS 설정 가이드

이 가이드는 Incue 웹사이트의 문의하기 폼을 sales@incue.co.kr로 연결하기 위한 EmailJS 설정 방법을 안내합니다.

## 1. EmailJS 계정 생성

1. [EmailJS 웹사이트](https://www.emailjs.com/)에 접속합니다.
2. **Sign Up** 버튼을 클릭하여 계정을 생성합니다.
3. 이메일 인증을 완료합니다.

## 2. Email Service 연결

1. EmailJS 대시보드에서 **Email Services** 메뉴로 이동합니다.
2. **Add New Service** 버튼을 클릭합니다.
3. 사용할 이메일 서비스를 선택합니다 (Gmail, Outlook 등).
4. 서비스 설정:
   - **Service ID**: 자동 생성되거나 직접 입력 (예: `service_incue`)
   - **Service Name**: Incue Contact Form
   - 이메일 계정 연결 (OAuth 인증 또는 SMTP 설정)
5. **Create Service** 버튼을 클릭합니다.
6. **Service ID**를 복사해둡니다.

## 3. Email Template 생성

1. EmailJS 대시보드에서 **Email Templates** 메뉴로 이동합니다.
2. **Create New Template** 버튼을 클릭합니다.
3. 템플릿 설정:

### 템플릿 기본 정보
- **Template Name**: Incue Contact Form
- **Template ID**: `template_incue_contact` (원하는 ID 입력)

### 템플릿 내용 (Template Content)

**Subject (제목):**
```
[Incue 문의] {{from_name}}님의 문의사항
```

**Content (본문):**
```
신규 문의가 접수되었습니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 문의 정보

• 담당자명: {{from_name}}
• 이메일: {{from_email}}
• 회사명: {{company}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💬 문의 내용:

{{message}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

답변은 {{reply_to}} 주소로 회신하실 수 있습니다.

이 메일은 Incue 웹사이트 문의하기 폼을 통해 자동 발송되었습니다.
```

### Settings (설정)
- **To Email**: `sales@incue.co.kr`
- **From Name**: `{{from_name}}`
- **Reply To**: `{{reply_to}}`

4. **Save** 버튼을 클릭합니다.
5. **Template ID**를 복사해둡니다.

## 4. Public Key 확인

1. EmailJS 대시보드에서 **Account** 메뉴로 이동합니다.
2. **General** 탭에서 **Public Key**를 확인합니다.
3. Public Key를 복사해둡니다.

## 5. 웹사이트 코드 업데이트

`js/main.js` 파일을 열고 다음 부분을 찾습니다:

```javascript
config: {
  serviceId: 'YOUR_SERVICE_ID',        // Replace with your EmailJS Service ID
  templateId: 'YOUR_TEMPLATE_ID',      // Replace with your EmailJS Template ID
  publicKey: 'YOUR_PUBLIC_KEY'         // Replace with your EmailJS Public Key
},
```

복사한 값으로 교체합니다:

```javascript
config: {
  serviceId: 'service_incue',           // 2단계에서 복사한 Service ID
  templateId: 'template_incue_contact', // 3단계에서 복사한 Template ID
  publicKey: 'YOUR_ACTUAL_PUBLIC_KEY'   // 4단계에서 복사한 Public Key
},
```

## 6. 테스트

1. 웹사이트를 로컬에서 실행하거나 배포합니다.
2. Contact Us 페이지(`/cs/contact.html`)로 이동합니다.
3. 테스트 문의를 작성하여 제출합니다.
4. `sales@incue.co.kr` 이메일 계정을 확인하여 메일이 수신되었는지 확인합니다.

## 7. 무료 플랜 제한사항

EmailJS 무료 플랜:
- 월 200개 이메일 전송 가능
- 2개의 Email Services
- 제한 없는 Email Templates
- 기본 기술 지원

더 많은 메일 전송이 필요한 경우 유료 플랜으로 업그레이드할 수 있습니다.

## 문제 해결

### 메일이 전송되지 않는 경우

1. **브라우저 콘솔 확인**: F12를 눌러 Console 탭에서 에러 메시지를 확인합니다.
2. **Service ID, Template ID, Public Key 확인**: 올바른 값이 입력되었는지 확인합니다.
3. **EmailJS 대시보드 확인**: Email Service가 활성화되어 있는지 확인합니다.
4. **스팸 폴더 확인**: 수신된 메일이 스팸으로 분류되지 않았는지 확인합니다.

### CORS 에러가 발생하는 경우

EmailJS는 기본적으로 CORS를 허용합니다. 하지만 문제가 발생하면:
1. EmailJS 대시보드에서 **Allowed Domains**를 확인합니다.
2. 본인의 도메인이 허용 목록에 있는지 확인합니다.

## 추가 리소스

- [EmailJS 공식 문서](https://www.emailjs.com/docs/)
- [EmailJS 템플릿 가이드](https://www.emailjs.com/docs/user-guide/creating-email-template/)
- [EmailJS API 참조](https://www.emailjs.com/docs/sdk/send/)

---

설정 중 문제가 발생하면 EmailJS 고객 지원팀에 문의하거나 공식 문서를 참고하세요.
