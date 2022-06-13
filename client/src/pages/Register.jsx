import { useState } from "react";
import styled from "styled-components";
import { mobile } from "../responsive";
import axios from "axios";
import {Link,useNavigate} from 'react-router-dom'
import { axiosInstance } from "../config";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://images.pexels.com/photos/6984661/pexels-photo-6984661.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 40%;
  padding: 20px;
  background-color: white;
  ${mobile({ width: "75%" })}
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 20px 10px 0px 0px;
  padding: 10px;
`;

const Agreement = styled.span`
  font-size: 12px;
  margin: 20px 0px;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
`;



const Register = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: ""
  })
  const [error,setError] = useState("")
  const navigate = useNavigate()
  const handleChange = ({ currentTarget: Input }) => {
    setData({ ...data, [Input.name]: Input.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      const url = "http://localhost:5000/api/auth/register"
      const {data:res} = await axiosInstance.post(url,data)
      navigate("/Login")
      console.log(res.message)
    }catch(error){
      if(error.response && error.response.status
        >= 400 && error.response.status <= 500){
          setError(error.response.data.message)
        }
    }
  }
  return (
    <Container>
      <Wrapper>
        <Title>CREATE AN ACCOUNT</Title>
        <Form onSubmit={handleSubmit}>
          <Input placeholder="First Name"
            type="text"
            name='firstName'
            onChange={handleChange}
            value={data.firstName}
            required
          />
          <Input placeholder="Last Name"
            type="text"
            name='lastName'
            onChange={handleChange}
            value={data.lastName}
            required
          />
          <Input placeholder="Username"
            type="text"
            name='username'
            onChange={handleChange}
            value={data.username}
            required
          />
          <Input placeholder="Email"
            type="email"
            name='email'
            onChange={handleChange}
            value={data.email}
            required
          />
          <Input placeholder="Password"
            type="password"
            name='password'
            onChange={handleChange}
            value={data.password}
            required
          />
          {/* <Input placeholder="last name" />
                    <Input placeholder="username" />
                    <Input placeholder="email" />
                    <Input placeholder="password" />
                    <Input placeholder="confirm password" /> */}
          <Agreement>
            By creating an account, I consent to the processing of my personal
            data in accordance with the <b>PRIVACY POLICY</b>
          </Agreement>
          <Button>CREATE</Button>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Register;
