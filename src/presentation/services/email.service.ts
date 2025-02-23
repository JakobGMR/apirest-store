import nodemailer, { Transporter } from 'nodemailer';

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachements?: Attachement[];
}

export interface Attachement {
  filename: string;
  path: string;
}


export class EmailService {

  private transporter: Transporter;

  constructor(
    mailerService: string,
    mailerEmail: string,
    senderEmailKey: string,
    private readonly postToProvider: boolean,
  ){
    this. transporter = nodemailer.createTransport( {
        service: mailerService,
        auth: {
          user: mailerEmail,
          pass: senderEmailKey,
        }
      });
  }


    async sendEmail( options: SendMailOptions ): Promise<boolean> {

        const { to, subject, htmlBody, attachements = [] } = options;


        try {
          // Para mandar o no un email
          if(!this.postToProvider) return true;

            const sentInformation = await this.transporter.sendMail( {
            to: to,
            subject: subject,
            html: htmlBody,
            attachments: attachements,
        });

        return true;
        } catch ( error ) {
        return false;
        }
    }
}