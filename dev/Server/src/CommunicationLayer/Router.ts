import express from 'express';
import Controller from './Controller';

const router = express.Router();

router.get('/enter', Controller.enter);
router.post('/register', Controller.register)
router.post('/login', Controller.login)


export = router;
