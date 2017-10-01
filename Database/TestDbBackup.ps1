# backup_AllDb.ps1
# Full backup for database for specified SQL instance
#
# Change log:
# July 3, 2012: Thomas LaRock, http://thomaslarock.com
# Initial Version
# Get the SQL Server instance name from the command line
# leaving $dest null will result in default backup path being used
param(
    [string]$inst="EDLAPTOP\EDLAPTOPPROD",
    [string]$dest="E:\SQLServerProd\MSSQL13.EDLAPTOPPROD\MSSQL\Backup\",
    [string[]]$excludedDbs=("tempDB", "master", "model", "msdb"),
    [int]$daysToKeepOldBackups=2
    )
 
# Load SMO assembly, and if we're running SQL 2008 DLLs load the SMOExtended and SQLWMIManagement libraries
$v = [System.Reflection.Assembly]::LoadWithPartialName( 'Microsoft.SqlServer.SMO')
if ((($v.FullName.Split(','))[1].Split('='))[1].Split('.')[0] -ne '9') {
    [System.Reflection.Assembly]::LoadWithPartialName('Microsoft.SqlServer.SMOExtended') | out-null
    [System.Reflection.Assembly]::LoadWithPartialName('Microsoft.SqlServer.SQLWMIManagement') | out-null
    }
 
# Handle any errors that occur
Function Error_Handler {
    Write-Host "Error Category: " + $error[0].CategoryInfo.Category
    Write-Host " Error Object: " + $error[0].TargetObject
    Write-Host " Error Message: " + $error[0].Exception.Message
    Write-Host " Error Message: " + $error[0].FullyQualifiedErrorId
    }
 
Trap {
    # Handle the error
    Error_Handler;
    # End the script.
    break
    }
 
$srv = new-object ('Microsoft.SqlServer.Management.Smo.Server') $inst
 
# If missing set default backup directory.
If ($dest -eq "")
    { $dest = $srv.Settings.BackupDirectory + "\" };
    Write-Output ("Started at: " + (Get-Date -format yyyy-MM-dd-HH:mm:ss));
 
    #start full backups
    foreach($database in $srv.Databases|where-object {$excludedDbs -notcontains $_.name  } ) {
        $dbName = $database.Name
        if ($dbName -ne "tempdb" -Or $dbName -ne "master" -Or $dbName -ne "model" -Or $dbName -ne "msdb") {
            $timestamp = Get-Date -Format yyyy_MMM_dd_hh_mm
            $bakFile = $dest + "\" + $dbName + "\" + $dbName + "_full_" + $timestamp + ".bak"
            Backup-SqlDatabase -Database $dbName -Initialize -BackupFile $bakFile -ServerInstance $inst
        }
        $Now = Get-Date
        $LastWrite = $Now.AddDays(-$daysToKeepOldBackups)
        #----- get files based on lastwrite filter in the specified folder ---#
        $dirToClear=$dest + "\" + $dbName
        $Files = Get-Childitem $dirToClear -Include $Extension -Recurse | Where {$_.LastWriteTime -le "$LastWrite"}
        foreach ($File in $Files)
            {
            if ($File -ne $NULL)
                {
                write-host "Deleting File $File" -ForegroundColor "Red"
                Remove-Item $File.FullName | out-null
                }
            else
                {
                Write-Host "No files to delete!" -foregroundcolor "blue"
                }
            }
    }
Write-Output ("Finished at: " + (Get-Date -format yyyy-MM-dd-HH:mm:ss));