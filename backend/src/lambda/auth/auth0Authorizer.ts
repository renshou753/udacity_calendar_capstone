import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'


import { JwtPayload } from '../../auth/JwtPayload'
import { verify } from 'jsonwebtoken'


const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJRzEBbjEXpa0uMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1kMWFra2Rydy51cy5hdXRoMC5jb20wHhcNMjAwNjI2MTQ0MjQxWhcN
MzQwMzA1MTQ0MjQxWjAkMSIwIAYDVQQDExlkZXYtZDFha2tkcncudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2I/McVrI7ipjU2h+
l/ZWo1Pa2iH31jaEj6UYjxPNNBXuBhEu9RtS90amuzvugbyRZd9ehKbVTJsvEs8c
T43GqddIvmgmP6aGuCmH6V3BwAp+nwOXBj/wJr7QahULJN08vSyjEcX3Bi8xBnfN
sFJDSt3OqoxK+7c/WPrwH0IKiyQpSXJORa72QpQ6IiodpAJVKoF778vGwe9LSlna
xj4imCIZDVoGvUjR08qNeP+Cj5XEMTadq/RztRtL5Yl0yldY0hHkQo9dTk5NflBE
dhDBV0mJjemCt63xHU43srJu1pliYlL3pvSDC/r5VEoO/EtQv9iuRLAveNWw4u7Z
wxsfWwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSPI1qser1p
36Ihc6DmdPrtUOOwgDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
ALYQ+hEqoIQgeHjz3+oi1xBe6vdoHJhNjLNYyryZoWtmEoU0qKOTW/kgHwqAKYMY
S2Awk7CS5lOLT/kF6E6xlBDd2gLdy2Wcrpfa0i67WJ7tn+qqM6TJ+yhKfs6Kxzv/
6V2XSGSo33+2wJGX6yWy0kUo7IlUNIe+f89QDSlhtzjN1Ft6jDhvidlBLogXHpR3
vERoSMJWnHlzySuqz0TNg3b4o+hKhq7PFCV9qgwhz+VLU+kU2CRxF5OE+0iMGSwd
BHr/99DWuWOODyyFAn/TX8QseVDlln37m2XHuu0LlI7SfLWRAu0U7UUAa1DLF5/O
FCpzWQ790M7jAW0ieTBVz8M=
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const decodedToken = verifyToken(event.authorizationToken)
    console.log('User was authorized')

    return {
      principalId: decodedToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User was not authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtPayload{
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]
  
  return verify(token, cert, {algorithms:['RS256']}) as JwtPayload
  

  // request has been authrorized
}


