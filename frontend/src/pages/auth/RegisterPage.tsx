import React from 'react';
import { Link } from 'react-router-dom';
import classes from './RegisterPage.module.css';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const RegisterPage: React.FC = () => {
  return (
    <Card className={classes.container}>
      <CardHeader>
        <h2 className={classes.title}>Start Your Journey</h2>
        <p className={classes.subtitle}>Join travelers mapping the world's cultures.</p>
      </CardHeader>
      
      <CardContent>
        <form className={classes.form}>
          <Input 
            type="text" 
            label="Full Name" 
            placeholder="Marco Polo" 
            required 
          />
          <Input 
            type="email" 
            label="Email Address" 
            placeholder="nomad@example.com" 
            required 
          />
          <Input 
            type="password" 
            label="Password" 
            placeholder="Create a password" 
            required 
          />
          <Input 
            type="password" 
            label="Confirm Password" 
            placeholder="Confirm your password" 
            required 
          />

          <Button type="submit" variant="primary" size="lg" style={{ marginTop: 'var(--ne-2)' }}>
            Create Account
          </Button>
        </form>
      </CardContent>

      <CardFooter className={classes.footer}>
        <p className={classes.footerText}>
          Already have an account? 
          <Link to="/login" className={classes.footerLink}>
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
