'use strict'
import axios from 'axios'

const initialState = {
  images: [],
  currentImage: {},
}

// const STORED_NEW_IMAGE = 'STORED_NEW_IMAGE'
const ANALYZED_IMAGE = 'ANALYZED_IMAGE'
const FETCHED_IMAGES = 'FETCHED_IMAGES'

const analyzedImage = imageDetails => ({
  type: ANALYZED_IMAGE,
  imageDetails,
})

const fetchedImages = () => ({
  type: FETCHED_IMAGES,
})

// const storedNewImage = () => ({
//   type: STORED_NEW_IMAGE,
// })

// export const storeNewImage = dataUrl => async dispatch => {
//   try {
//     const { data } = await axios.post('https://api.imgur.com/3/image', {
//       type: 'base64',
//       image: dataUrl,
//       headers: {
//         Authorization: 'Client-ID 7b3236e6fd9e639',
//         Accept: 'application/json',
//       },
//     })
//     console.log('IMGUR THUNK: ', data)
//     dispatch(storedNewImage())
//   } catch (error) {
//     console.error(error)
//   }
// }
export const fetchImages = () => dispatch => {
  dispatch(fetchedImages())
}

export const analyzeNewImage = imageUrl => async dispatch => {
  try {
    const { data } = await axios.post(
      'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=smile%2Cemotion%2Cexposure',
      { url: imageUrl },
      {
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': '9346ac1329e943b4ae740b22f1508f9b',
        },
      }
    )
    // console.log('THIS IS THE DATA: ', data)
    dispatch(analyzedImage(data))
  } catch (error) {
    console.error(error)
  }
}

const imageReducer = (state = initialState, action) => {
  switch (action.type) {
    case ANALYZED_IMAGE: {
      const execute =
        state.images.length < 10
          ? [...state.images, action.imageDetails]
          : [...state.images.slice(1), action.imageDetails]
      return {
        ...state,
        images: execute,
        currentImage: { ...action.imageDetails },
      }
    }

    case FETCHED_IMAGES: {
      return { ...state }
    }

    default: {
      return { ...state }
    }
  }
}

export default imageReducer