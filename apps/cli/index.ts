#! /usr/bin/env bun
import { intro, outro } from '@clack/prompts';
import { select } from '@clack/prompts';

intro(`HideMyKeys CLI`);

const functionToUse = await select({
  message: 'What would you like to do?',
  options: [
    { value: 'login', label: 'Login',hint: 'Choose this to authenticate before you run one of your HideMyKeys project in this machine' },
    { value: 'run', label: 'Run a project', hint: 'Choose this if you are already logged in and want to run one of your HideMyKeys project in this machine'}, 
    { value: 'logout', label: 'Logout'} 
  ],
});

outro(`Thank you`);
