import { describe, test, expect } from '@jest/globals';
import request from 'supertest'; //send fake http req (replace ment of postman for automation testing)
import { app } from '../app.js';

describe('POST /tasks', () => {
  //Group of tests for POST /tasks

  test('should create task', async () => {
    //One specific test case

    //actual req
    const response = await request(app).post('/tasks').send({
      title: 'Learn CI/CD',
    });

    expect(response.statusCode).toBe(201); //I expect status code to be 201
    expect(response.body.success).toBe(true); //I expect success=true
    expect(response.body.task.title).toBe('Learn CI/CD');
  });
});

/*                                  //# Run it
//? for es-module
{
  "scripts": {
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"
  }
}

//? for common js 
{
  "scripts": {
    "test": jest
  }
}
*/
