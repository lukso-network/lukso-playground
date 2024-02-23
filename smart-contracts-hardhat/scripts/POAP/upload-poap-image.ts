import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
const JWT = 'your-piñata-jwt-token';

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
    const image = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        //   maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
          Authorization: `Bearer ${JWT}`,
        },
      },
    );
    console.log(image.data);
  } catch (error) {
    console.log(error);
  }
};
pinFileToIPFS();
