import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Button } from '@mui/material'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { handleLogoutAPI } from '~/apis'
import beautifulMoutain from '~/assets/digital-art-beautiful-mountains.jpg'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT, TAB_URL } from '~/utils/constants'

function Dashboard() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/dashboards/access`)
      //const userInfoFromLocalStorage = JSON.parse(localStorage.getItem('userInfo'))
      setUser(res.data)
    }
    fetchData()
  }, [])
  const location = useLocation()
  const getDefaultActiveTab = () => {
    let activeTab = TAB_URL.DASHBOARD
    Object.values(TAB_URL).forEach((tabUrl) => {
      if (location.pathname.includes(tabUrl)) { activeTab = tabUrl }
    })
    return activeTab
  }
  const [tab, setTab] = useState(getDefaultActiveTab)
  const handleChange = (event, newTab) => {
    setTab(newTab)
  }
  const handleLogout = async() => {
    await handleLogoutAPI()
    localStorage.removeItem('userInfo')
    navigate('/login')
  }
  if (!user) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}>
        <CircularProgress />
        <Typography>Loading dashboard user...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{
      maxWidth: '1200px',
      margin: '0 auto',
      marginTop: '1em',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '0 1em',
      gap: 2
    }}>
      <Box as={Link} to='https://www.facebook.com/' target="blank">
        <Box
          component="img"
          src={beautifulMoutain}
          alt="beautifulMoutain"
          sx={{ width: '100%', height: '180px', borderRadius: '6px', boxShadow: 2, objectFit: 'cover' }}
        />
      </Box>
      <Alert severity="info" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
        Đây là trang Dashboard sau khi user:&nbsp;
        <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{user?.email}</Typography>
        &nbsp; đăng nhập thành công thì mới cho truy cập vào.
      </Alert>

      <Alert severity="success"
        variant="outlined"
        sx={{
          '.MuiAlert-message': { overflow: 'hidden' },
          width: { md: 'max-content', xs: '100%' }
        }}>
          role hiện tại của bạn là:&nbsp;
        <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>
          {user?.role}
        </Typography>
      </Alert>
      <Button
        type= 'button'
        variant= 'contained'
        color= 'info'
        size='large'
        sx={{ mt: 2, maxWidth:'100%', alignSelf:'flex-end' }}
        onClick={handleLogout}
      >
        Log out
      </Button>

      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={tab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Dashboard" value={TAB_URL.DASHBOARD} component= {Link} to={'/dashboard'} />
              <Tab label="Support" value={TAB_URL.SUPPORT} component= {Link} to={'/support'} />
              <Tab label="Message" value={TAB_URL.MESSAGE} component= {Link} to={'/message'} />
              <Tab label="Revenue" value={TAB_URL.REVENUE} component= {Link} to={'/revenue'} />
              <Tab label="Admin Tools" value={TAB_URL.ADMIN_TOOLS} component= {Link} to={'/admin-tools'} />
            </TabList>
          </Box>
          <TabPanel value={TAB_URL.DASHBOARD}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              Dashboard
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center' }}>
              This is the dashboard page.
            </Typography>
          </TabPanel>
          <TabPanel value={TAB_URL.SUPPORT}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              Support
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center' }}>
              This is the support page.
            </Typography>
          </TabPanel>
          <TabPanel value={TAB_URL.MESSAGE}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              Message
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center' }}>
              This is the message page.
            </Typography>
          </TabPanel>
          <TabPanel value={TAB_URL.REVENUE}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            REVENUE
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center' }}>
              This is the revenue page.
            </Typography>
          </TabPanel>
          <TabPanel value={TAB_URL.ADMIN_TOOLS}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            ADMIN_TOOLS
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center' }}>
              This is the admin-tools page.
            </Typography>
          </TabPanel>
        </TabContext>
      </Box>


    </Box>
  )
}

export default Dashboard
