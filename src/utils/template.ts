import * as ejs from 'ejs';
export interface TemplateData {
    projectName: string
    description: string
}
export function renderTemplate(content: string, data: TemplateData) {
    return ejs.render(content, data);
}