interface ContactTemplateData {
  type: string;
  email: string;
  message: string;
  name: string;
}

export const ContactTemplate = (data: ContactTemplateData) => `
  <h1>New contact message. Type: ${data.type}</h1>
  <h2>${data.name}, ${data.email}</h2>
  <br/>
  <p>${data.message}</p>
`;
