import Sample from '@/app/modules/sign-in/Sample' // sample imports from modules to this page must be like this
import { SAMPLE_SIGN_IN_DATA } from '@/app/constants/sign-in/constants' //and lengthy text must be put in constants folder then import here
export default function SignInPage() {
  return (
    <>
      <Sample />
      <h1>{SAMPLE_SIGN_IN_DATA.title}</h1>
    </>
  )
}
