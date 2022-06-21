import { Box, Button, Container, Paper, Slider, TextField, Typography } from '@mui/material';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import { getLicenseInfo, updateLicense } from './utils/generateLicense';
import React, { useEffect, useRef, useState } from 'react';
import Navigation from './components/Navigation';
import axios from './services/axios';
import CustomCaptcha from './components/CustomCaptcha';
import ActivationScreen from './components/ActivationScreen';

function App() {
  const [filters, setFilters] = useState<string[]>([]);
  const [file, setFile] = useState<File>();
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaImages, setCaptchaImages] = useState<{ url: string; }[]>([]);
  const [captchaSelection, setCaptchaSelection] = useState('');
  const [outputPath, setOutputPath] = useState('Downloads folder');
  const chooseFileRef = useRef<null | HTMLInputElement>(null);
  const handleChooseFileClick = () => {
    chooseFileRef.current?.click();
  }

  const handleAddFilter = (filterName: string) => {
    if (filters.includes(filterName)) {
      return setFilters((prev) => prev.filter((itm) => itm !== filterName))
    }

    setFilters((prev) => [...prev, filterName]);
  }

  const handleFileChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { files: filesLst } = e.currentTarget;
    const filesListArr: File[] = [];

    if (filesLst) {
      for (let i = 0; i < filesLst.length; i += 1) {
        filesListArr.push(filesLst[i]);
      }

      setFile(filesListArr[0]);
      setOutputPath((prev) => `${prev}/${filesListArr[0].name}`)
    }
  }

  const saveFile = async (blob: File) => {
    const a = document.createElement('a');
    a.download = blob.name;
    a.href = URL.createObjectURL(blob);
    a.addEventListener('click', (e) => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
    setFile(undefined);
  };

  const handleApply = () => {
    if (file) {
      saveFile(file);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('/generate-captcha');
        setCaptchaImages(data.results);
        setCaptchaSelection(data.toSelect);
      } catch (error) {
        console.log('ERROR', error);
      }
    })()
  }, []);

  useEffect(() => {
    updateLicense("launchesNumber", +JSON.parse(localStorage.getItem("license") as string).launchesNumber + 1);
  }, []);


  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 20, width: 420 }}>
      <Navigation />
      {getLicenseInfo().isLicensedExpired ? <ActivationScreen /> : <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', fontSize: 56 }}>
          <PhotoCameraBackIcon fontSize='inherit' />
          <Typography variant="h1" sx={{ fontSize: 36, fontWeight: 500, ml: 2 }}>Image Changer</Typography>
        </Box>
        <Box>
          <Typography>Choose an image to process</Typography>
        </Box>
        <Box sx={{ width: '100%', mt: 3, 'button': { width: '100%', height: 44 } }}>
          <Button variant="contained" onClick={handleChooseFileClick}>CHOOSE</Button>
          <Button variant="contained" sx={{ backgroundColor: 'black' }}>RESET SELECTED IMAGE</Button>
        </Box>
        <Box sx={{ textTransform: 'uppercase' }}>
          <Button variant="contained"
            onClick={() => handleAddFilter("invert")}
            sx={{ backgroundColor: filters.includes('invert') ? 'red' : '' }}>INVERT</Button>
          <Button variant="contained"
            onClick={() => handleAddFilter("grayscale")}
            sx={{ backgroundColor: filters.includes('grayscale') ? 'red' : '' }}>GRAYSCALE</Button>
          <Button variant="contained"
            onClick={() => handleAddFilter("sepia")}
            sx={{ backgroundColor: filters.includes('sepia') ? 'red' : '' }}>SEPIA</Button>
          <Button variant="contained"
            onClick={() => handleAddFilter("brightness")}
            sx={{ backgroundColor: filters.includes('brightness') ? 'red' : '' }}>BRIGHTNESS</Button>
        </Box>
        <Box sx={{ width: '100%' }}>
          <Button variant="contained"
            sx={{ width: '50%', backgroundColor: filters.includes('sharpen') ? 'red' : '' }} onClick={() => handleAddFilter("sharpen")}>SHARPEN</Button>
          <Button variant="contained"
            sx={{ width: '50%', backgroundColor: filters.includes('blur') ? 'red' : '' }} onClick={() => handleAddFilter("blur")}>BLUR</Button>
        </Box>
        <Box sx={{ width: '100%' }}>
          <Button
            sx={{ width: 'inherit', height: 50, mt: 2 }}
            variant="outlined"
            component="label"
          >
            Dropdown an image
            <input
              type="file"
              onChange={handleFileChange}
              ref={chooseFileRef}
              hidden
            />
          </Button>
        </Box>
        <Typography sx={{ my: 2 }}>
          <b>Quality: </b>
          <Box sx={{ fontStyle: 'italic' }} component="span">
            The lower quality, the smaller file size
          </Box>
        </Typography>
        <Slider
          size="small"
          defaultValue={50}
          valueLabelDisplay="auto"
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: 'black', mt: 3.25, width: '100%' }}
          onClick={handleApply}
          disabled={!file || !captchaVerified}
        >
          Apply
        </Button>
        <CustomCaptcha
          images={captchaImages}
          type={captchaSelection}
          setCaptchaImages={setCaptchaImages}
          setCaptchaSelection={setCaptchaSelection}
          setCaptchaVerified={setCaptchaVerified}
          captchaVerified={captchaVerified}
        />
        <Paper sx={{ width: '100%', textAlign: 'center', p: 5, mt: 7 }}>
          <Typography>Output Path: <b>{outputPath}</b></Typography>
        </Paper>
        <Typography sx={{ textAlign: 'center', my: 2.5 }}>Or set custom path:</Typography>
        <TextField
          sx={{ width: '100%' }}
          disabled
          placeholder="disabled on browser"
          variant="standard"
        />
        <Typography><b>WARNING:</b> Currently, image filters may not be working. For questions, contact sopronukCC@gmail.com</Typography>
      </Box>}
    </Container>
  );
}

export default App;
