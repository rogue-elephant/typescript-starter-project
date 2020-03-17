import * as ejs from 'ejs';

export function renderTemplate(content: string, data: any) {
    return ejs.render(content, data);
}