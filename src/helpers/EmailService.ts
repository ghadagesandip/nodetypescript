import * as mailer from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import * as pug from 'pug';

/**
 * EmailServer
 */
export class EmailServer {
  public async sendEmail(options: any): Promise<any> {
    const transporter: any = mailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_HOST),
      secure: Boolean(process.env.SECURE), // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USERNAME, // generated ethereal user
        pass: process.env.EMAIL_PASS, // generated ethereal password
      },
    });

    const mailOptions: Mail.Options = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
    };

    if (options.templateName) {
      mailOptions.html = await this.getTemplate(
        options.templateName,
        options.replace,
      );
    }

    return transporter.sendMail(mailOptions);
  }

  /**
   *
   * @param templateName
   */
  private async getTemplate(
    templateName: string,
    options: object = {},
  ): Promise<string> {
    return pug.renderFile(
      `${__dirname}/../../views/email-templates/${templateName}.pug`,
      options,
    );
  }
}
