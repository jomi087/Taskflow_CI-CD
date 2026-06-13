import { describe, test, expect } from '@jest/globals';
import request from 'supertest'; //send fake http req (replace ment of postman for automation testing)
import { app } from '../app.js';

describe('get /health', () => {
  //Group of tests for get /health

  test('should return a healthy status response', async () => {
    //One specific test case

    //actual req
    const response = await request(app).get('/health');

    expect(response.statusCode).toBe(200); //I expect status code to be 200
    expect(response.body.success).toBe(true); //I expect success=true
    expect(response.body.msg).toBe('working perfectly');
  });
});

/*                         //# Run It
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
