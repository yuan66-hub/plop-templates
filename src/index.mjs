import viewGenerator from './plop-templates/prompt.mjs';

export default function (plop) {
  plop.setGenerator('view', viewGenerator);
}
