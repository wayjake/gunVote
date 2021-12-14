import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import GUN from 'gun/gun'
const gun = GUN(['https://relay.peer.ooo/gun'])

const redName = '000'
const blueName = 'fff'

const Button = styled.div`
    padding: 0.5rem 0;
    padding-top: 2rem;
    margin: 0.5rem 1rem;
    width: 11rem;
    color: #777;
    border-radius: 10px;
    box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset,
        rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
        rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
    text-align: center;
    vertical-align: middle;
    border: #777 solid 2px;
    height: 42px;
    font-weight: 800;
    cursor: pointer;
`

const TopBar = styled.div`
    width: 100%;
    height: 30px;
    position: fixed;
    display: flex;
    flex: 0 0 100%; /* flex-grow, flex-shrink, flex-basis */
    padding-top: 9px;
    padding-left: 7px;
    padding-bottom: 0px;
    border-bottom: solid thin #777;
`

const Item = styled.div`
    margin-left: 10px;
`

const VoteWrapper = styled.div`
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
`

const AppWrapper = styled.div`
    height: 100%;
`

function App() {
    const [blueVotes, setBlueVotes] = useState(0)
    const [redVotes, setRedVotes] = useState(0)
    const loaded = useRef({ red: false, blue: true })

    const redVotesRef = gun.get('redVotes').get('number')
    const blueVotesRef = gun.get('blueVotes').get('number')

    useEffect(() => {
        return redVotesRef.on((data) => {
            console.log(data)
            loaded.current.red = true
            setRedVotes(data)
        })
    }, [])

    useEffect(() => {
        return blueVotesRef.on((data) => {
            console.log(data)
            loaded.current.blue = true
            setBlueVotes(data)
        })
    }, [])

    const voteRed = () => {
        if (!loaded.current.red) return
        return redVotesRef.once((data) => {
            redVotesRef.put(data + 1)
        })
    }

    const voteBlue = () => {
        if (!loaded.current.blue) return
        return blueVotesRef.once((data) => {
            blueVotesRef.put(data + 1)
        })
    }

    return (
        <AppWrapper>
            <TopBar>
                <Item>
                    {redName}-Votes: {redVotes || 'NA'}
                </Item>
                <Item>
                    {blueName}-Votes: {blueVotes || 'NA'}
                </Item>
            </TopBar>

            <VoteWrapper>
                <Button onClick={voteRed}>{redName} </Button>
                <Button onClick={voteBlue}>{blueName} </Button>
            </VoteWrapper>
        </AppWrapper>
    )
}

export default App
