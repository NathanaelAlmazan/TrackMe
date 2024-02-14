import webpush from 'web-push';
import dataClient from "../data-client";

export async function sendNotification(officeId: number, subject: string, description: string) {
    const officers = await dataClient.officers.findMany({
        where: {
            officeId: officeId
        }
    });

    const payload = JSON.stringify({
        title: subject,
        body: description, 
        icon: 'https://res.cloudinary.com/ddpqji6uq/image/upload/v1691402859/bir_logo_hdniut.png'
    });

    officers.forEach(officer => {
        if (officer.device) webpush.sendNotification(
            JSON.parse(officer.device), payload)
            .catch(err => console.error(err))
    })
}