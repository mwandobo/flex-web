import { post } from "../api";
import { getValueFromLocalStorage } from "./local-starage";

export async function send_email(emailBody: any) {
    const token = getValueFromLocalStorage('token')
    const response = await post('send_email', emailBody, token)

    console.log(response)

    return response

}