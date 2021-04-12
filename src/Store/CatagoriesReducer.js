import {createContext, useReducer, useEffect} from 'react';
import axios from 'axios'
import {warningToast,successToast,infoToast} from '../UI/Toast/Toast'

export const CatagoriesContext=createContext();

export const CatagoriesProvider=({children})=>{

    const catagoriesManipulation=(state,action)=>{
        switch (action.type) {
            case "CREATE_VIDEOLIST":
                return{
                    ...state,
                    fullVideoList:[...action.payload]
                }
            case "CREATE_PLAYLIST":
                return{
                    ...state,
                    playlists:[...action.payload]
                }
            case "ADD_NEWPLAYLIST":    
            return{
                    ...state,
                    playlists:[...state.playlists,action.payload]
                }
            case "FILTER_VIDEO_BY_CATAGORY":
                return{
                    ...state,
                    currentCatagoryId:action.payload,
                    selectedVideo:state.fullVideoList.filter(({catagoryId})=>catagoryId===action.payload)[0]
                }
            case "SELECT_VIDEO":
                return{
                    ...state,
                    selectedVideo:{...action.payload}
                }
            case "VIDEO_ADDED_TO_PLAYLIST":
                return{
                    ...state,
                    playlists:[...action.payload.playlist],
                    selectedVideo:{...state.selectedVideo,playlist:action.payload.playlistid},
                    fullVideoList:[...action.payload.fullVideosList],
                    history:[...action.payload.history]
                }
            case "VIDEO_REMOVED_FROM_PLAYLIST":
                return{
                    ...state,
                    selectedVideo:{...state.selectedVideo,playlist:null},
                    playlists:[...action.payload.playlist],
                    fullVideoList:[...action.payload.fullVideosList],
                    history:[...action.payload.history]
                }
            case "DELETE_PLAYLIST":
                return{
                    ...state,
                    playlists:[...action.payload.playlist],
                    fullVideoList:[...action.payload.fullVideosList],
                    history:[...action.payload.history]
                }
            case "ADD_TO_HISTORY":
                return{
                    ...state,
                    history:[...action.payload]
                }
            case "ADD_NOTES_TO_VIDEO":
                return{
                    ...state,
                    playlists:[...action.payload.playlist],
                    fullVideoList:[...action.payload.fullVideosList],
                    history:[...action.payload.history],
                    selectedVideo:{...state.selectedVideo,notes:[...state.selectedVideo.notes,action.payload.note]}
                }
            default:
                return state;
        }
    }

    const [state,dispatch]=useReducer(catagoriesManipulation,{
        fullVideoList:[],
        currentCatagoryId:null,
        selectedVideo:null,
        playlists:[],
        history:[]
    });

    const addVideoToPlaylist=async(selectedVideo,playlist)=>{
        if(!selectedVideo.playlist||(selectedVideo.playlist&&selectedVideo.playlist!==playlist.id)){
            const {data,status}=await axios.post("/api/add-video-to-playlist",{
                video:selectedVideo,
                playlistid:playlist.id
            })
            if(+status===201){
                dispatch({
                    type:"VIDEO_ADDED_TO_PLAYLIST",
                    payload:{
                        playlist:[...data.playlist.models],
                        fullVideosList:[...data.fullVideosList.models],
                        playlistid:playlist.id,
                        history:[...data.history.models]
                    }
                })
            }
        }else if(selectedVideo.playlist&&selectedVideo.playlist===playlist.id){
            const {data,status}=await axios.post("/api/remove-video-from-playlist",{
                video:selectedVideo,
                playlistid:playlist.id
            })
            if(+status===201){
                console.log(data)
                dispatch({
                    type:"VIDEO_REMOVED_FROM_PLAYLIST",
                    payload:{
                        playlist:[...data.playlist.models],
                        fullVideosList:[...data.fullVideosList.models],
                        playlistid:playlist.id,
                        history:[...data.history.models]
                    }
                })
            }
        }
    }

    const addNewPlaylist=async (newPlaylistName)=>{
        const {data,status}=await axios.post("/api/add-new-playlist",{
            name:newPlaylistName
        })
        if(+status===201){
            dispatch({
                type:"ADD_NEWPLAYLIST",
                payload:data.playList
            })
        }
    }

    const deletePlaylist=async (playlistid)=>{
        const {status,data}=await axios.delete("/api/delete-playlist",{params:playlistid})
        if(+status===200){
            dispatch({
                type:"DELETE_PLAYLIST",
                payload:{
                    playlist:[...data.playlist.models],
                    fullVideosList:[...data.fullVideosList.models],
                    history:[...data.history.models]
                }
            })
        }
    }

    const addNotes=async (videoId,note)=>{
        const {status,data}=await axios.post("/api/add-note-to-video",{
            videoId,note
        })
        if(+status===201){
            dispatch({
                type:"ADD_NOTES_TO_VIDEO",
                payload:{
                    playlist:[...data.playlist.models],
                    fullVideosList:[...data.fullVideosList.models],
                    history:[...data.history.models],
                    note:note
                }
            })
        }
    }

    const signUpUser=async (userData)=>{
        try{
            const {data,status}=await axios.post('/api/users',userData);
            if(data.ok)
                successToast("User Added Successfully")
            else{
                if(+status===208){
                    infoToast("User already exists in the pix ecosystem")
                    infoToast("Please Try loging in")
                }
                else
                    warningToast("Failed to add user")
            }
        }catch(error){
            warningToast("Failed to add user")
            console.log(error)
        }
    }

    const getFilteredData=(videoList,id)=>{
        if(id)
            return videoList.filter(item=>item.catagoryId===id)
        return []
    }

    const filteredData=getFilteredData(state.fullVideoList,state.currentCatagoryId)

    useEffect(()=>{
        (async()=>{
            if(state.selectedVideo){
                const {data,status}=await axios.post("/api/add-video-to-history",{
                    newVideo:state.selectedVideo
                })
                if(+status===201){
                    dispatch({
                        type:"ADD_TO_HISTORY",
                        payload:[...data.histories]
                    })
                }
            }
        })()
    },[state.selectedVideo])

    useEffect(()=>{
        (async()=>{
            try{
            const {data}=await axios.get("/api/videos")
            if(data.ok){
                dispatch({
                    type:"CREATE_VIDEOLIST",
                    payload:[...data.data]
                })
            }
            }catch(error){
                console.log(error)
            }
        })()
    },[])

    // useEffect(()=>{
    //     (
    //         async()=>{
    //             const {data}=await axios.get("/api/load-all-playlists")
    //             dispatch({
    //                 type:"CREATE_PLAYLIST",
    //                 payload:[...data.playLists]
    //             })
    //         }
    //     )()
    // },[])

    return(
        <CatagoriesContext.Provider 
            value={{
                dispatch:dispatch,
                videosByCatagory:filteredData,
                selectedVideo:state.selectedVideo,
                addVideoToPlaylist:addVideoToPlaylist,
                playlists:state.playlists,
                addNewPlaylist:addNewPlaylist,
                deletePlaylist:deletePlaylist,
                history:state.history,
                signUpUser:signUpUser,
                addNotes:addNotes
            }}
        >
            {children}
        </CatagoriesContext.Provider>
    )
}