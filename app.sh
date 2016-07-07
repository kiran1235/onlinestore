#!/bin/sh

function start(){
    filename1="log/server_log_`date "+%y_%m_%d_%H_%M_%S"`.log"
    filename2="log/console_log_`date "+%y_%m_%d_%H_%M_%S"`.log"
    filename3="log/script_log_`date "+%y_%m_%d_%H_%M_%S"`.log"

    pid="log/server.pid"
    echo `date`": Starting App"
    sh whatismyip.sh
    echo "Port:8100"
    screen -d -m -L ionic serve --nolivereload --nobrowser s $filename1 -c $filename2 -p 8100
    echo $! > $pid
    #ionic serve --nolivereload -s $filename1 -c $filename2 -p 8100 -b &
    #echo $! > $pid

}

function stop(){
#    filename="log/server_log_`date "+%y_%m_%d_%H_%M_%S"`.log"
    pid="log/server.pid"
    echo `date`": Stopping App"
    kill -9 `cat $pid`
#    for PID in `ps ax | grep "node" | awk ' {print $1;} '`; 
#        do kill -9 $PID; 
#    done
}

function usage() { 
    echo "Usage:\n $0 [-s start ]\n $0 [-x stop]" ; exit 1; 
}

f=1;

while getopts "sx" o; do
    case "${o}" in
        s)
            stop ;
            start ;
            ;;
        x)
            stop ;
            ;;
        *)
            usage ;
            ;;
    esac
    f=0;
done

if [ $f -eq 1 ]; then
    usage ;
fi
