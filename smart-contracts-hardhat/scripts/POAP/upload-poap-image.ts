import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
const JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyYTM5NzMzNS1kNDYyLTRlODQtYWFjZC00NmZkN2M4ZTY3NmIiLCJlbWFpbCI6ImplYW5AbHVrc28uaW8iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjUzY2JiZTZkNjM4ODQ0ODU2MTkiLCJzY29wZWRLZXlTZWNyZXQiOiJmMmQwM2NkOGRhMTI1MGM5MjJjOTE5NGE0Y2Q4MGRjYTE3MWIwNGVhM2UwYTZkNzNkMGQ3N2JkMjJiZGEzN2RlIiwiaWF0IjoxNzA4NTExODc1fQ.j87B0bCNa0jkJ3ID5GZjn6rWZLR8mI0bcHJQSHu5YVI';

const pinFileToIPFS = async () => {
  const formData = new FormData();
  const src = './scripts/POAP/POAPMetadata.json';

  const file = fs.createReadStream(src);
  formData.append('file', file);

  const pinataMetadata = JSON.stringify({
    name: 'POAP JSON Metadata',
  });
  formData.append('pinataMetadata', pinataMetadata);

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  });
  formData.append('pinataOptions', pinataOptions);

  try {
    const image = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      //   maxBodyLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
        Authorization: `Bearer ${JWT}`,
      },
    });
    console.log(image.data);
  } catch (error) {
    console.log(error);
  }
};
pinFileToIPFS();
