import { Box, Button, Grid, Typography } from '@mui/material';
import React, { FC, useState } from 'react'
import axios from '../services/axios';
import CustomSnackbar from './CustomSnackbar';

type CustomCaptchaProps = {
  images: { url: string }[];
  type: string;
  setCaptchaImages: any;
  setCaptchaSelection: any;
  setCaptchaVerified: any;
  captchaVerified: boolean;
}

const CustomCaptcha: FC<CustomCaptchaProps> = ({
  images,
  captchaVerified,
  type = '',
  setCaptchaSelection,
  setCaptchaImages,
  setCaptchaVerified,
}) => {
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState<number[]>([]);

  const handleImageSelection = (index: number) => {

    if (answers.includes(index)) {
      return setAnswers((prev) => prev.filter((itm) => itm !== index));
    }

    setAnswers((prev) => [...prev, index]);
  }

  const handleSubmission = async () => {
    try {
      console.log('answers', answers)
      await axios.post('/validateForm', { answers });
      setCaptchaVerified(true);
    } catch (error: any) {
      console.log('ERROR', error.response.data.error)
      setError(error.response.data.error);
      setCaptchaImages([]);
      const { data: data2 } = await axios.get('/generate-captcha');
      setCaptchaImages(data2.results.map((itm: { url: string }) => ({ url: itm.url.concat(`?unique=${Math.random()}`) })));
      setCaptchaSelection(data2.toSelect);
      setAnswers([]);
    }
  }

  return (
    !captchaVerified ? <Box>
      <CustomSnackbar message={error} setMessage={setError} />
      <Typography textAlign="center" sx={{ mt: 3 }} variant="h6">Please, select: {type}</Typography>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {images.map((itm, idx) => {
          return (
            <Grid
              item xs={Math.floor(12 / images.length - 3)}
              sx={{
                'img': {
                  cursor: 'pointer',
                  outline: answers.includes(idx) ? `solid 3px black` : '',
                  width: '120px',
                  height: '120px',
                  objectFit: 'cover'
                }
              }}
            >
              <img src={itm.url} alt="Captcha" onClick={() => handleImageSelection(idx)} />
            </Grid>
          )
        })}
      </Grid>
      <Button
        variant="contained"
        disabled={answers.length < 1}
        sx={{ width: '100%', mt: 2 }}
        onClick={handleSubmission}>
        Check Captcha
      </Button>
    </Box> : null
  )
}

export default CustomCaptcha