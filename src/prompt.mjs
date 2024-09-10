import fs from 'fs';
import { notEmpty } from './utils.mjs';

export default {
  description: 'generate a view',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: '请输入文件名名称',
      validate: notEmpty('name'),
    },
    {
      type: 'input',
      name: 'filename',
      message: '请输入文件夹名称',
      validate: notEmpty('filename'),
    },
    {
      type: 'checkbox',
      name: 'blocks',
      message: 'Blocks:',
      choices: [
        {
          name: '<template>',
          value: 'template',
          checked: true,
        },
        {
          name: '<script>',
          value: 'script',
          checked: true,
        },
        {
          name: 'style',
          value: 'style',
          checked: true,
        },
        {
          name: 'form',
          value: 'form',
          checked: true,
        },
      ],
      validate(value) {
        if (
          value.indexOf('script') === -1 &&
          value.indexOf('template') === -1
        ) {
          return '至少选择<script>标签和<template>标签';
        }
        return true;
      },
    },
    {
      type: 'comfirm',
      name: 'wantRouter',
      message: '是否要生成新的路由',
      default: 'Y',
    },
  ],
  actions: (answers) => {
    const name = '{{ name }}';
    const filename = '{{ filename }}';
    const actions = [];
    const data = {
      name: name,
      template: answers.blocks.includes('template'),
      script: answers.blocks.includes('script'),
      style: answers.blocks.includes('style'),
      form: answers.blocks.includes('form'),
    };
    actions.push({
      type: 'add',
      path: `src/views/${filename}/${name}.vue`,
      templateFile: 'plop-templates/views/index.hbs',
      data,
    });
    if (answers.wantRouter.toLowerCase() === 'y') {
      const filePath = `./src/router/routes/modules/${answers.filename.toLowerCase()}.ts`;
      const routeRow = `{
            path: '/{{ filename }}/{{ name }}',
            name: '{{  properCase name }}',
            component: () => import('#/views/{{ filename }}/{{ name }}.vue'),
            meta: {
              title: '',
              ignoreKeepAlive: false,
            },
        },`;

      if (fs.existsSync(filePath)) {
        actions.push({
          type: 'append',
          path: filePath,
          pattern: /(\/\/append new router)/gi,
          unique: false,
          // camelCase 用来将输入的名称转化为驼峰
          // $1 用于在结束的时候添加匹配的占位，用于下次使用
          template: `${routeRow}\n$1`,
          data,
        });
      } else {
        actions.push({
          type: 'add',
          path: 'src/router/routes/modules/{{camelCase filename}}.ts',
          templateFile: 'plop-templates/router/index.hbs',
          data,
        });
      }
    }

    return actions;
  },
};
